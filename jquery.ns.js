(function($){

    var F = function (){},
        push = [].push,
        pushStack = $.fn.pushStack;
    
    $.fn.toArray = Array.prototype.slice;
        
    $.fn.pushStack = function() {
        if ( this.proto ) {
            var init = $.fn.init,
                tmp = init.prototype;
            init.prototype = this.proto;
            var ret = pushStack.apply( this, arguments );
            init.prototype = tmp;
            return ret;
        } else {
            return pushStack.apply( this, arguments );
        }
    };

    function create_$( proto ) {
        return function() {
            var init = $.fn.init,
                tmp = init.prototype;
            init.prototype = proto;
            var ret = $.apply( this, arguments );
            init.prototype = tmp;
            return ret;
        };
    }
    
    function create(o) {
        F.prototype = o;
        return new F();
    }
    
    function child_ns( parent, name ) {
        var ns = parent[ name ];
        
        //create child namespace if necessary
        if ( !ns || !parent.hasOwnProperty(name) ) {
            //create the namespace object
            parent[ name ] = ns = create( parent );
            ns.parent = parent;
            
            //create the proto object
            var proto = create( parent.fn );
            
            //to easily retrieve the prototype of an instance ($.fn.pushStack)
            proto.proto = proto;
            
            proto._ns_ = ns;
            
            //expose the proto to the namespace
            ns.fn = proto;
            
            ns.$ = create_$( proto );
            parent.fn[ name ] = function(sel){ return this.ns(ns, sel); };
        }
        
        return ns;
    }
    
    function get_sub_ns( ns, name ) {
        var parts = name.split('.'),
            i = 0, l = parts.length;
        
        if ( !parts[0] ) ++i;
        if ( !parts[l-1] ) --l;
        
        for ( ; i < l; ++i ) {
            ns = parts[i] ? child_ns( ns, parts[i] ) : ns.parent;
        }
        
        return ns;
    }
    
    $.ns = function( name, body ) {
        var ns = get_sub_ns( this, name );
        
        if ( body ) {
            body.call( ns, ns.$ || ns );
        }
    
        return ns;
    };
    
    $.fn.ns = function( nsOrName, selector ) {
        var ns = (typeof nsOrName === "string") ?
            get_sub_ns(this._ns_ || $, nsOrName) : nsOrName;
        
        var ret = create( ns.fn );
        ret.selector = this.selector;
        ret.context = this.context;
        ret.length = 0;
        push.apply( ret, this.toArray() );
            
        if ( selector ) {
            ret = ret.find( selector );
        }
        
        ret.prevObject = this;
        
        return ret;
    }
    
})(jQuery);