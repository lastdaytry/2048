define([
    'backbone',
], function(
    Backbone
) {

    var View = Backbone.View.extend({
        views: {},
        initialize: function() {
            var self = this;
            $(document).on("show", function(event) {
                _.each(self.views, function(value, key) {
                    if (event._name !== key) {
                        value.hide();
                    }
                });
            });
        },

        addView: function(name, view) {
            this.views[name] = view;
        }

    });

    var viewManager = new View();
    return viewManager;
});
