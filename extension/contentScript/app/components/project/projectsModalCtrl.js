angular.module('MyApp')
  .controller('ProjectsModalCtrl', ProjectsModalCtrl);

function ProjectsModalCtrl($stateParams, _DEV, Slack, $modalInstance, PostMessageService, CurrentUser, Project) {

  log = _DEV.log('NEW PROJECT');

  var currentUser = CurrentUser.get();

  var channelId = $stateParams.channelId;

  var rangeSlider = {

    min: 1,
    max: 100,
    range: 'min'

  };

  var ctrl = this;

  angular.extend(ctrl, {

    closeModal: closeModal,
    submit: submit,
    currentUser: currentUser,
    rangeSlider: rangeSlider,
    channelName: "",
    contributorsValid: true,
    project: {
      channelId: channelId,
      similarEvaluationRate: '50',
      passingResponsibilityRate: '50'
    }

  });

  init();

  function init() {

    PostMessageService.hideIframe();
    PostMessageService.showIframe();

    Slack.getChannel(channelId).then(function(response) {
      log("init Slack.getChannel", channelId, response.channel.name);
      ctrl.channelName = response.channel.name;
    });

  }

  function closeModal() {
    $modalInstance.dismiss('cancel');
  };

  function submit() {

    Project.create(ctrl.project).then(

      function() {
        PostMessageService.showAlert('Successfully created project', 'success');
        $modalInstance.close('submit');
      },

      function(err) {
        log("submit", err);
        PostMessageService.showAlert('Your project was not created', 'error');
      }

    )

  }

}