angular.module('MyApp').directive('selectContributors', selectContributors);

function selectContributors() {

  return {

    bindToController: { contributors: '=', contributorsValid: '=' },
    controllerAs: 'ctrl',
    templateUrl: 'directives/selectContributors/selectContributors.html',
    controller: selectContributorsController,
    restrict: 'E',
    scope: true

  };

}

function selectContributorsController($timeout, _DEV, Resource, Account, AllSlackUsers) {

  var log = _DEV.log("SELECT CONTRIBUTORS");

  var ctrl = this;

  var access_token;

  angular.extend(ctrl, {

    addContributor: addContributor,
    removeContributor: removeContributor,
    refreshUsersToSelectFrom: refreshUsersToSelectFrom,
    getTotalSum: getTotalSum,
    selectedContributorId: '',
    usersToSelectFrom: [],
    contributors: [],
  });

  init();

  function init() {
    log('init');
    Account.getProfile().success(function(user) {
      access_token = user.access_token;
      setCurrentUserAsFirstContributor(user);
    });
  }

  function setCurrentUserAsFirstContributor(currentUser) {
    ctrl.contributors[0] = {
      id: currentUser.slackUserId,
      url: currentUser.url,
      name: currentUser.displayName,
      contributor_percentage: 100,
      real_name: currentUser.user_realname
    };

    focusContributorPercentage(currentUser.slackUserId);
  }

  function focusContributorPercentage(id) {
    log('focusContributorPercentage', id);
    $timeout(function() {
      angular.element('#' + id).trigger('focus');
    }, 200);
  }

  function addContributor(contributor) {
    ctrl.contributors.push(contributor);
    ctrl.usersToSelectFrom = [];
    focusContributorPercentage(contributor.id);
  }

  function removeContributor(i) {
    ctrl.contributors.splice(i, 1);
  }

  function refreshUsersToSelectFrom(searchQuery) {
    if (! access_token) return;
    var userIds = getContributorsIds();
    ctrl.foo = AllSlackUsers.allSlackUsers({'access_token':access_token,'userIds':userIds,'searchString':searchQuery});
    ctrl.foo.$promise.then(function(result) {
      ctrl.usersToSelectFrom = result;
    });

    // TODO - refactor to method below. Remove AllSlackUsers.allSlackUsers
    // Resource.getSlackUsers(access_token, searchQuery, userIds)
    // .then(function(users) {
    // });
  }

  function getTotalSum() {
    var total = 0;

    $.each(ctrl.contributors, function(i, contributor) {
      if (contributor.contributor_percentage === '')
        return;

      total += parseFloat(contributor.contributor_percentage);
    });

    ctrl.contributorsValid = total === 100;

    return total;
  }

  function getContributorsIds() {
    return ctrl.contributors.map(toUid).join(",");
  }

  function toUid(contributor) {
    return contributor.id;
  }

}