(function($){

    var F = function (){},
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
    
    function create(o) {
        F.prototype = o;
        return new F();
    }

    function create_$( proto ) {
        return function() {
            var ret = create( proto );
            ret.init.apply( this, arguments );
            return ret;
        };
    }
    
    function create_converter( proto ) {
        var push = Array.prototype.push;
        
        return function( selector ) {
            var ret = create( proto );
            ret.selector = this.selector;
            ret.context = this.context;
            ret.length = 0;
            push.apply( ret, this.toArray() );
            
            if ( selector ) {
                ret = ret.find( selector );
            }
            
            ret.prevObject = this;
            
            return ret;
        };
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
            
            //expose the proto to the namespace
            ns.fn = proto;
            
            ns.$ = create_$( proto );
            parent.fn[ name ] = create_converter( proto );
        }
        
        return ns;
    }
    
    $.ns = function( name, body ) {
        var ns = this,
            parts = name.split('.'),
            i = 0, l = parts.length;
        
        if ( !parts[0] ) {
            ++i;
        }
        
        if ( !parts[l-1] ) {
            --l;
        }
        
        for ( ; i < l; ++i ) {
            ns = parts[i] ? child_ns( ns, parts[i] ) : ns.parent;
        }
        
        if ( body ) {
            body.call( ns, ns.$ || ns );
        }
    
        return ns;
    };
    
})(jQuery);