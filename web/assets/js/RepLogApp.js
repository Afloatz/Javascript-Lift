// Create the object RepLopApp
var RepLogApp = {
    initialize: function ($wrapper) {
        this.$wrapper = $wrapper;

        this.$wrapper.find('.js-delete-rep-log').on(
            'click',
            this.handleRepLogDelete.bind(this)
        );

        this.$wrapper.find('tbody tr').on(
            'click',
            this.handleRawClick.bind(this)
        );
    },

    updateTotalWeightLifted: function () {
        var totalWeight = 0;
        this.$wrapper.find('tbody tr').each(function () {
            totalWeight += $(this).data('weight');

        });

        this.$wrapper.find('.js-total-weight').html(totalWeight);
    },

    handleRepLogDelete: function (e) {
        // To avoid going back at the top of the page because of the html tag <a href="#">
        e.preventDefault();

        var $link = $(e.currentTarget);
        // To put the Delete in red, keyword this refers to the clicked element
        $link.addClass('text-danger');

        // To have a rotating spinner instead of the trash when clicking on delete
        $link.find('.fa')
            .removeClass('fa-trash')
            .addClass('fa-spinner')
            .addClass('fa-spin');

        // To delete the entire row
        // .data() is a shortcut to read a data attribute
        var deleteUrl = $link.data('url');
        var $row = $link.closest('tr');
        // Use of the variable self to ensure that in our callback function success, "this" is the object RepLogApp
        var self = this;
        $.ajax({
            url: deleteUrl,
            method: 'DELETE',
            success: function () {
                $row.fadeOut('normal', function () {
                    $(this).remove();
                    self.updateTotalWeightLifted();

                });
            }
        });
    },

    handleRawClick: function () {
        console.log('Row clicked');
    }
};