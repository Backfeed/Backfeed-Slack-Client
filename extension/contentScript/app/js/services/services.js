angular.module('MyApp').factory('services', function(Account, GetEvaluationOfContribution) {
    var services = {};
    services.getContribution = function(contributionId) {
        var that = this;
        Account.getProfile().success(function(data) {
            Account.setUserData(data);
            var user = Account.getUserData();
            that.contribution = GetEvaluationOfContribution.Evaluation({
                'contributionId': contributionId,
                'userId' : user.userId
            });
        });
        return this.contribution;
    };
    return services;
});