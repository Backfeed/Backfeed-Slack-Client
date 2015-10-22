angular.module('MyApp')
  .service('Contribution', Contribution);

function Contribution(_DEV, Resource, Slack) {

  var log = _DEV.log('CONTRIBUTION SERVICE');

  var service = {

    create: create,
    get: get,
    evaluate: evaluate

  };

  return service;

  function create(contribution) {

    var contributionToSubmit = getPreparedContributionForCreation(contribution);

    log('create', contributionToSubmit);

    return Resource.post('contribution', contributionToSubmit).then(function(contributionResponse) {
      Slack.postMessage(contributionToSubmit.channelId, buildContributionMessage(contributionToSubmit,contributionResponse.id));
    });

  }
  
  function get(contributionId) {
    return Resource.get('contribution/' + contributionId);
  }

  function evaluate(contributionId, evaluation) {
    return Resource.post('bids', {
      contributionId: contributionId,
      evaluation: evaluation
    });
  }

  function buildContributionMessage(contributionToSubmit,contributionId) {
    var contributorsString = '';
    var contributorsLength = contributionToSubmit.contributors.length;
    var index = 0;
    contributionToSubmit.contributors.forEach(function(contributor) {
      if (index == contributorsLength - 1) {
        contributorsString += '@' + contributor.name + ' ' + contributor.percentage + '%';
      } else {
        contributorsString += '@' + contributor.name + ' ' + contributor.percentage + '%, ';
      }
      index++;
    });

    return 'New contribution submitted' + '\n' + contributionId + '\n' + '*' + contributionToSubmit.title + '*' + '\n' + contributionToSubmit.description + '\n' + contributorsString;
  }


  function getPreparedContributionForCreation(contribution) {

    var contributionToSubmit = angular.copy(contribution);

    contributionToSubmit.contributors = _.map(contributionToSubmit.contributors, function(contributor) {

      return {

        id: contributor.id,
        percentage: contributor.percentage,
        name: contributor.name

      }

    });

    return contributionToSubmit;

  }

}