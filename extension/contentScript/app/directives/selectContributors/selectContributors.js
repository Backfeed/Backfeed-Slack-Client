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

function selectContributorsController($timeout, _DEV, Resource, CurrentUser, User) {

  var log = _DEV.log("SELECT CONTRIBUTORS DIRECTIVE");

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
	log('comes here'+currentUser.slackUserId);
    ctrl.contributors[0] = {
      id: currentUser.slackUserId,
      imgUrl: currentUser.imgUrl,
      name: currentUser.displayName,
      percentage: 100,
      real_name: currentUser.user_realname
    };
    log(ctrl.contributors[0].id);
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

  function refreshUsersToSelectFrom(query) {
    if (! query)
      return;
    
    var userIdsToExclude = getContributorsIds();

    log("refreshUsersToSelectFrom by query", query, "exclude users with ids", userIdsToExclude);

    User.getByQuery(query, userIdsToExclude).then(function(users) {
      log("CB refreshUsersToSelectFrom", users);
      ctrl.usersToSelectFrom = users;
    });

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