(function() {
    var assert = require("assert");
    
    suite("Context", function() {
        var D = require('../index');
        var App = D.Application;

        test('test context name', function() {
            var context = new D.Context('outercalls');
            return assert.equal(context.getName(), '[outercalls]');
        });

        test('check context content for one extension', function() {
            var context = new D.Context('outercalls');

            var extension = new D.Extension('_2XXXXXX');
            context.append(extension);
            
            extension.append(App.Dial('qw', 120));

            return assert.deepEqual(
                context.getContentForOneExtension(extension),
                ['exten=>_2XXXXXX,1,Dial(qw,120)']
                );
        });

        test('check get context as array', function() {
            var context = new D.Context('outercalls');

            var extension = new D.Extension('_2XXXXXX');
            context.append(extension);
            
            extension.append(App.Dial('qw', 120));
            extension.append(App.Dial('qq', 130));

            var array = context.getExtensionsAsPlainArray();

            return assert.deepEqual(array,
                [
                    '_2XXXXXX,1,Dial(qw,120)', 
                    '_2XXXXXX,2,Dial(qq,130)'
                ]);
        });

    });

}).call(this);