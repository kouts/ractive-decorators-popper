import Popper from 'popper.js';

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
        args = arguments;
        clearTimeout(timeout);
        if (immediate && !timeout) func.apply(context, args);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
    };
}

function popper_decorator(el, options) {
    var r = this;
    let trigger = el.querySelector('[popper-trigger]');
    let pop = el.querySelector('[popper]');
    let defaults = {
        click_to_close: true,
        enable_arrows: true,
        popover: false
    }
    options = Object.assign(defaults, options);
    // If it's a bootstrap popover we have to take care of the popover class to be inline with the poppers placement
    if(options.popover === true){
        let placement = undefined;
        options.onCreate = function(data){
            data.instance.popper.classList.remove('bs-popover-'+data.originalPlacement.split('-')[0]);
            data.instance.popper.classList.add('bs-popover-'+data.placement.split('-')[0]);
        }
        options.onUpdate = function(data){
            if(!placement){
                placement = data.placement;
            }
            if(placement != data.placement){
                // console.log('placement changed');
                data.instance.popper.classList.remove('bs-popover-'+placement.split('-')[0]);
                data.instance.popper.classList.add('bs-popover-'+data.placement.split('-')[0]);
                placement = data.placement;
            }
        }
    }
    let self = pop.decorator = {
        popper: null,
        init: function(){
            trigger.addEventListener('click', self.toggle);
        },
        destroy: function(){
            trigger.removeEventListener('click', self.toggle);
            self.close();
        },
        click: function(e){
            // console.log('Firing document click');
            if(options.click_to_close === true){
                if(trigger.contains(e.target)){
                    // console.log('closing will be handled by toggle');
                } else {
                    self.close();
                }
            } else {
                if(trigger.contains(e.target) || pop.contains(e.target)){
                    // console.log('do nothing, closing will be handled by toggle');
                } else {
                    self.close();
                }
            }
        },
        keydown: function(e){
            // Up (38) and down (40) arrow keys (works only in <li><a href=""></a></li> structures)
            // Note: IE does not focus on disabled elements
            // console.log('Firing document keydown');
            if(options.enable_arrows && (e.keyCode == 40 || e.keyCode == 38)){
                e.preventDefault();
                if(document.activeElement == trigger || document.activeElement == pop){
                    var a = pop.querySelector('a.dropdown-item');
                    if(a){
                        a.focus();
                    }
                    return;
                }
                if(pop.contains(document.activeElement) && document.activeElement.tagName.toLowerCase() === 'a' && document.activeElement.classList.contains('dropdown-item')){
                    var is_list = false;
                    // Item might be an a or an li element depending on the dropdown structure
                    var item = document.activeElement;
                    if(document.activeElement.parentElement.tagName.toLowerCase() === 'li'){
                        item = document.activeElement.parentElement;
                        is_list = true;
                    }
                    var next_or_prev = 'nextElementSibling';
                    if(e.keyCode == 38){
                        next_or_prev = 'previousElementSibling';
                    }
                    // Get the next or prev sibling element
                    item = item[next_or_prev];
                    // As long as a sibling exists
                    while (item) {
                        if(item.offsetHeight == 0){
                            item = item[next_or_prev];
                            continue;
                        }
                        // If we've reached our match, bail
                        // In case item is an li
                        if(is_list){
                            if (item.querySelector('a')){
                                break;
                            }
                        // In case item is an a
                        } else {
                            if (item && item.classList.contains('dropdown-divider') === false && item.classList.contains('dropdown-header') == false){
                                break;
                            }
                            if (item && item[next_or_prev].classList.contains('dropdown-header')){
                                item = item[next_or_prev];
                            }
                        }
                        // Get the next or prev sibling
                        item = item[next_or_prev];
                    }
                    if(item){
                        if(is_list){
                            item.querySelector('a').focus();
                        } else {
                            item.focus();
                        }
                    }
                }
            }
            if (e.keyCode == 27){
                document.removeEventListener('keydown', self.keydown);
                self.close();
            }
        },
        resize: debounce(function(){
            // console.log('Firing window resize');
            if(pop.classList.contains('dropdown-menu-rwd') && !window.matchMedia('(max-width: 991px)').matches){
                window.removeEventListener('resize', self.resize);
                self.close();
            }
        }, 350),
        open: function(){
            let ctx = r.getContext(pop);
            ctx.raise('popper_before_open');
            el.classList.add('show');
            pop.classList.add('show');
            if(!self.popper){
                self.popper = new Popper(trigger, pop, options);
            }
            document.addEventListener('click', self.click);
            document.addEventListener('keydown', self.keydown);
            window.addEventListener('resize', self.resize);
            ctx.raise('popper_open');
        },
        close: function(){
            let ctx = r.getContext(pop);
            ctx.raise('popper_before_close');
            el.classList.remove('show');
            pop.classList.remove('show');
            if(self.popper){
                self.popper.destroy();
            }
            self.popper = null;
            document.removeEventListener('click', self.click);
            document.removeEventListener('keydown', self.keydown);
            window.removeEventListener('resize', self.resize);
            ctx.raise('popper_close');
        },
        toggle: function(e){
            e.preventDefault();
            if(el.classList.contains('show')){
                self.close();
            } else {
                self.open();
            }
        }
    }
    pop.decorator.init();
    return {
        teardown: function(){
            pop.decorator.destroy();
        }
    };
}

export default popper_decorator;