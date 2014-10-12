var neo4j = require('neo4j');
var __ = require('underscore');
var dataEntry = require('../modules/dataentry');
db = new neo4j.GraphDatabase('http://localhost:7474');


module.exports = {
    cord_add: function(req, res, next) {
        console.log('request received', req.query);
        var action  = req.query.action_state,
            params = req.query,
            query = '';

        if(action === 'changestate'){
            query = dataEntry.createStatesApp(params);
        }

        if(action === 'initalize'){
            query = dataEntry.createDeviceStateStart(params);
        }

        if(action === 'tap'){
            // console.log("tap");
            query = dataEntry.createDeviceApp(params);
        }

        var params = {};

        // CREATE (himym:TVShow { name: 'How I Met Your Mother' })
        db.query(query, params, function (err, results) {
            if (err) {
                throw err;
            }
        });

        res.json({ message: 'Coordinate created!' });
    },

    cord_view: function(req, res, next) {

        var query = ['MATCH (n:node)-[r:point_interaction]-(m) WHERE n.id=~"banner_." RETURN n.id As state,m.x AS x,m.y AS y,m.y1 AS y1,m.x1 AS x1'].join('\n');
        var params = {};

        db.query(query, params, function (err, results) {
            if (err) {
                throw err;
            }

          res.json({ id: results });
        });
    },

    cord_remove: function(req, res, next) {
        Cord.remove({
            _id: req.params.cord_id
        }, function(err, cord) {
            if (err) {
                res.send(err);
            }

            res.json({ message: 'Successfully deleted' });
        });
    },

    banner: function(req, res, next) {
        var isHeatmap = req.param('heatmap');
        if (isHeatmap) {
            var query = ['MATCH (n:node)-[r:point_interaction]-(m) WHERE n.id=~"banner_." RETURN n.id As state,m.x AS x,m.y AS y,m.y1 AS y1,m.x1 AS x1 '].join('\n');
            var params = {};

            db.query(query, params, function (err, results) {
                if (err) {
                    throw err;
                }

                res.render('banner.html', { heatmap: true, data: results });
            });
        } else {
            res.render('banner.html', { heatmap: false } );
        }
    },

    banner_data: function(req, res, next) {
        var query = ['MATCH (x:device) MATCH (n:node)-[r:point_interaction]-(m) WHERE n.id=~"banner_."  RETURN x.id AS ids,x.orientation AS lr,n.id As state,m.x AS x,m.y AS y,m.y1 AS y1,m.x1 AS x1'].join('\n');
        var params = {};

        db.query(query, params, function (err, results) {
            if (err) {
                throw err;
            }

            var users = __.groupBy(results, function(point){
                return point.ids;
            });

            res.render('data.html', { users: users });
            // res.send(users);
        });
    },

    banner_users: function(req, res, next) {
        var query = ['MATCH (x:device) MATCH (n:node)-[r:swipe_left]-(m:node) WHERE r.id=~".swipe_left" RETURN r.id AS ids,r.x AS x,r.y AS y,r.y1 AS y1,r.x1 AS x1,x.id AS id,x.orientation,x.device'].join('\n');
        var params = {};

        db.query(query, params, function (err, results) {
            if (err) {
                throw err;
            }
            var users = __.groupBy(results, function(point){
                var points = point.ids;
                delete point.ids;
                return points;
            });

            // res.send(users);
            console.log('sending users', users);
            res.render('data.html', { users: users });
        });
    }

}
