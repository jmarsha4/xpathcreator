requirejs.config({
    baseUrl: 'scripts',
    paths: {
        jquery: 'jquery-2.1.4.min',
        knockout: 'knockout-3.3.0',
        punches: "knockout.punches.min",
        xmlToJson: "xmlToJson",
        linq: "linq.amd",

        "ko-xml": "app/xml"

    }
});

require(["jquery", "knockout", "punches", "ko-xml"], function ($, ko) {

    function SomeComponentViewModel(params) {
        // 'params' is an object whose key/value pairs are the parameters
        // passed from the component binding or custom element.
        this.params = params;
    }
 
    
    

    ko.components.register('xml', {
        template: { require: 'text!components/xml.html' },
        viewModel: SomeComponentViewModel
    });



    ko.punches.enableAll();
    var viewModel = {
        xml: ko.observable('<xml hello="oh" goodbye="ah">xml text  <morexml>some more text</morexml><evenmorexml>some more text</evenmorexml> and some text hee</xml>')
    };
    ko.applyBindings(viewModel);
});