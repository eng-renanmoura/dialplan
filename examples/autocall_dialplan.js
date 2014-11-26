
var D = require('../index');
var A = D.Applications;
var H = D.Helpers;
var F = D.Functions;


var dialplan = new D.Dialplan();
var dh = dialplan.helpers();

var context = new D.Context('autocall');
dialplan.append(context);


var extension_S = new D.Extension('s');
context.append(extension_S);


var array = [
    new A.Set(new F.CDR('language'), 'ru'),
    new A.Set(new H.Global('CALL_IN'), 'yes'),

    new A.Set('incoming_number', new F.CHANNEL('dnid')),
    new A.Playback('/var/asterisk/sounds/8march-greeting'),

    new A.Set('dial', new H.Value('DIALSTATUS')),
    new A.Set('SHORT_NUMBER', new F.CUT(new H.Value('incoming_number'), 1, 3)),

    new A.Set('TRANSFER_COUNT', dh.expression(new H.Value('TRANSFER_COUNT'), '+', 1)),
    new A.Hangup(),
];

extension_S.append(array);

var extension_H = new D.Extension('h');
context.append(extension_H);

extension_H.append(new A.ExecIf(
    new H.Expression(new H.Value('HANGUPCAUSE'), '=', 16),
    new A.System("/tmp/bash.sh")
    ));


dialplan.save("/etc/asterisk/extensions_autocall.conf", function(err){
    if(!err) {
        console.log("The file was saved!");
    }
});
