define([
    'backbone',
    'tmpl/main',
    'vm'
], function(
    Backbone,
    tmpl,
    vm
){

    var View = Backbone.View.extend({

        template: tmpl,
        el: '.page__main',
        _name: 'main',

        initialize: function () {
            this.render();
            this.$el.hide();
            $('.loading').hide();

        },
        render: function () {
            this.$el.html(this.template);
        },
        show: function () {
            $.event.trigger({
                type: "show",
                name: this._name
            });
            this.$el.show();
        },
        hide: function () {
            this.$el.hide();
        }

    });

    return new View();
});
