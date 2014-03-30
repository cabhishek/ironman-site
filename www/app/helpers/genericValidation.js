module.exports = {
    valid: function(view, attr, selector) {

        view.element(attr, selector).hide();
        view.element(attr, selector).parent().removeClass("has-error");
    },
    invalid: function(view, attr, error, selector) {

        view.element(attr, selector).text(error).show();
        view.element(attr, selector).parent().addClass("has-error");
    }
};
