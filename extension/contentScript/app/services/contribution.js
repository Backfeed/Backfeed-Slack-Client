angular.module('MyApp')
  .service('Contribution', Contribution);

function Contribution(_DEV, Resource, Slack) {

  var log = _DEV.log('CONTRIBUTION');

  var service = {

    create: create,
    get: get

  };

  return service;

  function create(contribution) {

    var contributionToSubmit = getPreparedContributionForCreation(contribution);

    log('create', contributionToSubmit);

    return Resource.post('contribution', contributionToSubmit).then(function() {
      Slack.postMessage(contributionToSubmit.channelId, "Your contribution has been submitted!");
    });

  }

  function get(contributionId) {
    return Resource.get('contribution/' + contributionId);
  }

  function getPreparedContributionForCreation(contribution) {

    var contributionToSubmit = angular.copy(contribution);

    contributionToSubmit.contributors = _.map(contributionToSubmit.contributors, function(contributor) {

      return {

        id: contributor.id,
        percentage: contributor.percentage

      }

    });

    return contributionToSubmit;

  }

}