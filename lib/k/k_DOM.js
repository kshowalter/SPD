
var elem_prototype = {

    html: function(html){
       this.elem.innerHTML = html;
       return this;
    },
    append: function(sub_element){
        this.elem.appendChild(sub_element.elem); 
        return this;
    },
    appendTo: function(parent_element){
        parent_element.append(this); 
        return this;
    },
    attr: function(name, value ){
        var attributeName;
        if( name === 'class'){
            attributeName = 'className';
        } else {
            attributeName = name; 
        }
        this.elem[attributeName] = value; 
        return this;
    },



}

var Elem = function(element){
    var E = Object.create(elem_prototype);

    E.elem = element;

    return E;

}

var $ = function(input){
    if( typeof input === 'undefined' ) {
        //log('input needed');
        return false;
    }
    if( input.substr(0,1) === '#' ) {
        var element = document.getElementById(input.substr(1));
        return Elem(element);
    } else if( input.substr(0,1) === '.' ) {
        var element = document.getElementByClassName(input.substr(1)[0]);
        return Elem(element);
    } else {
        if( input === 'value' ) {
            var element = Value(); 
            return element;
        } else if( input === 'selector' ) {
            var element = Selector(); 
            return element;
        } else {
            var element = document.createElement(input);
            return Elem(element);
        }
    }
    


}
