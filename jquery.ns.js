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
    
    function create_ns( parent, name ) {
        //create the namespace object
        var ns = parent[ name ] = create( parent );
        ns.parent = parent;
        
        //create the proto object
        var proto = ns.fn = create( parent.fn );
        
        //to easily retrieve the prototype of an instance ($.fn.pushStack)
        proto.proto = proto;
        
        proto._ns_ = ns;
        
        ns.$ = create_$( proto );
        
        return ns;
    }
    
    $.ns = function( name, body ) {
        var ns = this,
            parts = name.split('.'),
            i = 0, l = parts.length;
        
        if ( !parts[0] ) ++i;
        if ( !parts[l-1] ) --l;
        
        for ( ; i < l; ++i ) {
            name = parts[i];
            ns = name ?
                ( ns.hasOwnProperty(name) ? ns[name] : create_ns(ns, name) ) :
                ns.parent;
        }
            
        if ( body ) {
            body.call( ns, ns.$ || ns );
        }
    
        return ns;
    };
    
    $.fn.ns = function( nsOrName ) {
        var ns = (typeof nsOrName === "string") ?
            ( this._ns_ || $ ).ns( nsOrName ) : nsOrName;
        
        var ret = create( ns.fn );
        ret.selector = this.selector;
        ret.context = this.context;
        ret.length = 0;
        push.apply( ret, this.toArray() );
        
        ret.prevObject = this;
        
        return ret;
    }
    
})(jQuery);