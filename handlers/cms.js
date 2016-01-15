var CMS = require('../agents/cms');
var UserAgent = require('../models/user');

module.exports = {
  displayCMSPage: function(request, reply) {
    CMS.getPage(request.params.slug).then(function(page) {
      reply.view('cms', {
        contentIsFullwidth: true,
        page: page,
        title: page.title
      });
    }).catch(function(err) {
      if (err.statusCode == 404) {
        request.logger.error(err);
        return reply.view('errors/not-found', err).code(404);
      } else {
        return reply(err);
      }
    });
  },

  dismissNotice: function(request, reply) {

    var agent = UserAgent.new(request);

    agent.get(request.loggedInUser.name).then(user => {
      user.resource.dismiss = '';
      agent.save();
      if (request.query.returnURL) {
        reply.redirect(validate(request.query.returnURL));
      } else {
        reply({ });
      }
    }).catch(reply);
  }

}


