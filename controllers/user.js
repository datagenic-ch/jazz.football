module.exports = function(controllers) {
    var User = require('../models/user');

    controllers.user = {

        getProfile: function (req, res) {
            res.json({
                name: req.user._doc.name,
                alias: req.user._doc.alias,
                email: req.user._doc.email
            });
        },

        updateProfile: function (req, res) {
            User.update(
                {
                    _id: req.user._id
                },
                {
                    alias: req.body.alias,
                    email: req.body.email
                }, function (err, num, raw) {
                    if (err)
                        res.send({error: err});
                    else
                        res.json({message: 'Updated'});
                }
            );
        }
    }
};
