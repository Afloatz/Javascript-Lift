
//This is a special JavaScript directive that tells your browser to activate a more strict parsing mode. Now, certain things that were allowed before, will cause legit errors.
'use strict';

// Self executing function
(function (window, $) {
    // Constructor
    window.RepLogApp = function ($wrapper) {
        this.$wrapper = $wrapper;
        // Returns a new instance of Helper, which we set on a property
        this.helper = new Helper($wrapper);

        this.$wrapper.on(
            'click',
            '.js-delete-rep-log',
            this.handleRepLogDelete.bind(this)
        );

        this.$wrapper.on(
            'click',
            'tbody tr',
            this.handleRawClick.bind(this)
        );

        this.$wrapper.on(
            'submit',
            '.js-new-rep-log-form',
            this.handleNewFormSubmit.bind(this)

        );
    };

    $.extend(window.RepLogApp.prototype, {
        updateTotalWeightLifted: function () {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.calculateTotalWeight()
            );
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
        },

        // We give the event argument to the function
        handleNewFormSubmit:function (e) {
            // It will prevent the form from submitting
            e.preventDefault();

            // Send the request via Ajax
            var $form = $(e.currentTarget);
            var $tbody = this.$wrapper.find('tbody');
            var self = this;
            $.ajax({
                url: $form.attr('action'),
                method: 'POST',
                data: $form.serialize(),
                // data is the html we want to put on the page
                success: function(data) {
                    $tbody.append(data);
                    self.updateTotalWeightLifted();
                },
                error: function(jqXHR) {
                    $form.closest('.js-new-rep-log-form-wrapper')
                        .html(jqXHR.responseText);
                }
            })
        }
    });

    /**
     *
     * A "private" object
     */
    /*We set Helper as a function so we can instantiate it and use the keyword new
      The function is the constructor */
    var Helper = function ($wrapper) {
        // We create the $wrapper property
        this.$wrapper = $wrapper;
    };

    $.extend(Helper.prototype, {
        calculateTotalWeight: function () {
            var totalWeight = 0;
            this.$wrapper.find('tbody tr').each(function () {
                totalWeight += $(this).data('weight');
            });

            return totalWeight;
        }
    });



})(window, jQuery);