angular.module('MyApp').directive('selectContributors', selectContributors);

function selectContributors() {

  return {

    bindToController: {},
    controllerAs: 'ctrl',
    templateUrl: 'directives/selectContributors/selectContributors.html',
    controller: selectContributorsController,
    scope: true,
    restrict: 'E'

  };

}

function selectContributorsController(_DEV, Resource, Account) {

  var log = _DEV.log("SELECT CONTRIBUTORS");

  var ctrl = this;

  var access_token;

  angular.extend(ctrl, {

    addContributor: addContributor,
    removeContributor: removeContributor,
    refreshUsersToSelectFrom: refreshUsersToSelectFrom,
    getTotalSum: getTotalSum,
    selectedContributerId: '',
    usersToSelectFrom: [],
    contributors: [],
  });

  init();

  function init() {
    log('init');
    Account.getProfile().success(function(user) {
      access_token = user.access_token;
    });
  }

  function addContributor(contributor) {
    ctrl.contributors.push(contributor);
  }

  function removeContributor(contributor, i) {
    ctrl.contributors.splice(i, 1);
  }

  function refreshUsersToSelectFrom(searchQuery) {
    if (! access_token) return;
    var userIds = getContributorsIds();
    log('refreshUsersToSelectFrom access_token, searchQuery, userIds: ', access_token, searchQuery, userIds);
    Resource.getSlackUsers(access_token, searchQuery, userIds)
    .then(function(users) {
      log('refreshUsersToSelectFrom response: ', users);
      ctrl.usersToSelectFrom = users;
    });
  }

  function getTotalSum() {
    var total = 0;

    $.each(ctrl.contributors, function(i, contributor) {
      if (contributor.contributor_percentage === '')
        return;

      total += parseFloat(contributor.contributor_percentage);
    });

    return total;
  }

  function getContributorsIds() {
    return ctrl.contributors.map(toUid);
  }

  function toUid(contributor) {
    return contributor.id;
  }

}