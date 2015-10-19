angular.module('MyApp')
  .directive('selectContributors', selectContributors);

function selectContributors() {

  return {

    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: chrome.extension.getURL("extension/contentScript/app/directives/selectContributors/selectContributors.html"),
    controller: selectContributorsController,
    restrict: 'E',
    scope: { contributors: '=', contributorsValid: '=' }

  };

}

function selectContributorsController($timeout, _DEV, Resource, CurrentUser, AllSlackUsers) {

  var log = _DEV.log("SELECT CONTRIBUTORS");

  var currentUser = CurrentUser.get();

  var ctrl = this;

  var slackAccessToken = currentUser.slackAccessToken;

  angular.extend(ctrl, {

    addContributor: addContributor,
    removeContributor: removeContributor,
    refreshUsersToSelectFrom: refreshUsersToSelectFrom,
    getTotalSum: getTotalSum,
    selectedContributorId: '',
    usersToSelectFrom: [],
    contributors: []

  });

  init();

  function init() {
    log('init');
    
    setCurrentUserAsFirstContributor();
  }

  function setCurrentUserAsFirstContributor() {
    ctrl.contributors[0] = {
      id: currentUser.slackUserId,
      imgUrl: currentUser.imgUrl,
      name: currentUser.displayName,
      percentage: 100,
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
    log("refreshUsersToSelectFrom", searchQuery);

    var userIds = getContributorsIds();

    ctrl.foo = AllSlackUsers.allSlackUsers({
      slackAccessToken: slackAccessToken,
      userIds: userIds,
      searchString:searchQuery 
    });
    
    ctrl.foo.$promise.then(function(result) {
      ctrl.usersToSelectFrom = result;
    });

    // TODO - refactor to method below. Remove AllSlackUsers.allSlackUsers
    // Resource.getSlackUsers(searchQuery, userIds)
    // .then(function(users) {
    // });
  }

  function getTotalSum() {
    var total = 0;

    _.each(ctrl.contributors, function(contributor) {

      if (contributor.percentage === '')
        return;

      total += parseFloat(contributor.percentage);

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