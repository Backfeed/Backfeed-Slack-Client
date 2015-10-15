angular.module('MyApp')
	.controller('MemberStatusModalCtrl', MemberStatusModalCtrl);

function MemberStatusModalCtrl ($stateParams, $modalInstance, _DEV, PostMessageService, User) {

	var log = _DEV.log('MEMBER STATUS CTRL');

	var userId = $stateParams.memberId;

	var ctrl = this;

  angular.extend(ctrl, {

    closeModal: closeModal,
    projectChanged: projectChanged,
    sortReverse: false,
    sortType: 'date',
    user: { projects: [] },
    contributions: [],
    code: '',
    tokens: 0,
    reputation: 0,
    tokensName: '',
    reputationPercentage: 0,
    activeProjectId: null

  });

  init();

  function init() {

    PostMessageService.hideIframe();
    PostMessageService.showIframe();

    getUser();
    getProjects();

  }

  function getUser() {
    User.get(userId).then(function(user) {
    	ctrl.user = user;
    });
  }

  function projectChanged() {
    if ( ctrl.activeProjectId ) {
      getProject();
    } else {
      getProjects();
    }
  }

  function getProjects() {
    User.getProjects(userId).then(function(projects) {
      angular.extend(ctrl, {
        code: '',
        tokens: 0,
        tokenName: '',
        reputation: 0,
        reputationPercentage: 0,
        contributions: projects.contributions
      });
    });
  }

  function getProject() {
    User.getProject(userId, ctrl.activeProjectId).then(function(project) {
      angular.extend(ctrl, {
        code: project.code,
        tokens: project.tokens,
        tokenName: project.tokenName,
        reputation: project.reputation,
        reputationPercentage: project.reputationPercentage,
    		contributions: project.contributions
      });
  	});
  }

	function closeModal() {
		$modalInstance.dismiss('cancel');
	}

}