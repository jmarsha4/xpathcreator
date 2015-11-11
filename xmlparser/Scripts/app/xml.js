define(["knockout", "xmlToJson", "linq"], function (ko, xmlToJson, linq) {
    ko.virtualElements.allowedBindings.xmlToJson = true;
    ko.bindingHandlers.xmlToJson = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            // Make a modified binding context, with a extra properties, and apply it to descendant elements
            var error = ko.observable();
            json = ko.pureComputed(function () {
                try {
                    error(undefined);
                    return xmlToJson.parseString(ko.utils.unwrapObservable(valueAccessor()));
                } catch (ex) {
                    error(ex);
                    return {};
                }
            });

            var innerBindingContext = bindingContext.extend(
                {
                    $json: json,
                    $jsonString: ko.pureComputed(function () { return JSON.stringify(json(), null, 4) }),
                    $jsonError: error
                }
            );
            ko.applyBindingsToDescendants(innerBindingContext, element);

            // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
            return { controlsDescendantBindings: true };
        }
    };

    


    ko.virtualElements.allowedBindings.iterate = true;
    ko.bindingHandlers.iterate = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            // Make a modified binding context, with a extra properties, and apply it to descendant elements
            var innerBindingContext = bindingContext.extend(
                {
                    $xpath: ko.utils.unwrapObservable(valueAccessor().key) ?  (bindingContext.$xpath || '') + '/' + ko.utils.unwrapObservable(valueAccessor().key) : '',
                    $iterate: ko.pureComputed(function () {
                        var value = ko.utils.unwrapObservable(valueAccessor().data);
                        return linq.From(value)
                            .SelectMany(function (v) {
                                return Object.keys(v)
                                    .filter(
                                        function (key) {
                                            return key !== "_attr";
                                        }
                                    )
                                    .map(
                                        function (key) {
                                            return {
                                                key: key,
                                                value: v[key],
                                                
                                            }
                                        }
                                    )
                            }
                        ).ToArray()
                    }),
                    $attributes: ko.pureComputed(function () {
                        var value = ko.utils.unwrapObservable(valueAccessor().data);
                        return linq.From(value)
                            .Where(function (v) {
                                return Object.keys(v).length && Object.keys(v)[0] === "_attr"
                            })
                            .SelectMany(function (attrs) {
                                return Object.keys(attrs._attr).map(function (key) {
                                    return {
                                        key: key,
                                        value: attrs._attr[key]._value
                                    }
                                })

                            }).ToArray()
                    })
                }
            );
            ko.applyBindingsToDescendants(innerBindingContext, element);

            // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
            return { controlsDescendantBindings: true };
        }
    };

});