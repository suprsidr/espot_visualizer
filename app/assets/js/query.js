var ibmdb = require('ibm_db');

// Catch all uncought node.js errors and report them to the console.
process.on('uncaughtException', function(err) {
  console.error(err);
});

ibmdb.open("DRIVER={DB2};DATABASE=STG01DB;HOSTNAME=cmp02-ws-stg-db01;UID=wcdbuser;PWD=h0r1z0n;PORT=50000;PROTOCOL=TCPIP", function (err,conn) {
  if (err) {
    process.exit(err);
  }
  var q = "select b.name, a.marketingtext from colldesc as a inner join collateral as b on a.collateral_id = b.collateral_id where a.collateral_id in (select collateral_id from collateral where storeent_id = 10151) with ur;";
  conn.query(q, [], function (err, data) {
    if (err) {
      process.exit(err);
    }
    //console.log(data);
    process.stdout.write(JSON.stringify(data));
    conn.close(function () {
      process.exit();
    });
  });
});

