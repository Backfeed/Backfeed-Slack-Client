angular.module('MyApp')
  .service('Contribution', Contribution);

function Contribution(_DEV, Resource) {

  var log = _DEV.log('CONTRIBUTION');

  var service = {

    create: create

  };

  return service;

  function create(contribution) {

    var contributionToSubmit = getPreparedContributionForCreation(contribution);

    log('create', contributionToSubmit);

    return Resource.post('contribution', contributionToSubmit);

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