angular.module('MyApp')
.controller('ContributionStatusModalCtrl', ContributionStatusModalCtrl);

function ContributionStatusModalCtrl($scope, $auth, $location, $stateParams, ContributionStatus,
  Account, Users, $modalInstance, PostMessageService) {

  var contributionStatusModel = {
    file: '',
    title: '',
    currentValuation: '',
    valueIndic: '',
    myWeight: '',
    myValuation: '',
    reputationDelta: '',
    groupWeight: '',
    bids: [{
      time_created: '',
      tokens: '',
      reputation: '',
      contribution_value_after_bid: '',
      owner: '',
      stake: ''
    }],
    contributionContributers: [{
      percentage: '',
      name: '',
      real_name: '',
      url: '',
      project_reputation: ''
    }]
  };

  angular.extend($scope, {
    closeModal: closeModal,
    contributionStatusModel: contributionStatusModel
  });

  init();

  function init() {
    // if not authenticated return to splash:
    if (!$auth.isAuthenticated()) {
      $location.path('splash');
    } else {
      $scope.contributionId = $stateParams.contributionId;
      var userData = Account.getUserData();
      console.log("userData is" + userData);
      if (userData == undefined) {
        getProfile();
      } else {
        $scope.userId = userData.userId;
        getContributionStatus();
      }

    }
  }



  function closeModal() {
    $modalInstance.dismiss('cancel');
  };

  function compareBids(a, b) {
    a = new Date(a.time_created);
    b = new Date(b.time_created);
    return a > b ? 1 : a < b ? -1 : 0;
  }

  function compareRanks(a, b) {
    var aFloat = parseFloat(a.project_reputation);
    var bFloat = parseFloat(b.project_reputation);
    return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
  }

  function InitBarChart(bids) {
    var maxToken = 0;
    var myStake = 0;
    for (var i = 0; i < bids.length; i++) {
      if (bids[i].tokens > maxToken) {
        maxToken = bids[i].tokens;
      }
      if (bids[i].owner == $scope.userId) {
        myStake = bids[i].stake;
      }
    }
    var bin = 10;
    var eachBucketSize = maxToken / bin;
    var barData = [];
    var binData = [];
    for (var i = 1; i <= bin; i++) {
      binData.push(0);
    }
    var totalStake = 0;
    var myBidIndex = 0;
    for (var i = 0; i < bids.length; i++) {
      totalStake = totalStake + bids[i].stake;

      for (var j = 1; j <= bin; j++) {

        if (bids[i].tokens <= j * eachBucketSize && bids[i].tokens > (j - 1) * eachBucketSize) {
          if (bids[i].owner == $scope.userId) {
            myBidIndex = j - 1;
          }
          binData[j - 1] = binData[j - 1] + bids[i].stake;
          break;
        }
      }
    }
    for (var i = 0; i < bin; i++) {
      var counter = (i + 1) * eachBucketSize;
      var stakePer = (binData[i] / totalStake) * 100;

      barData.push({
        "token": counter,
        "stake": stakePer,
        "color": "blue"
      });
      if (i == myBidIndex) {
        barData.push({
          "token": counter,
          "stake": (myStake / totalStake) * 100,
          "color": "brown"
        });
      }
    }
    var vis = d3.select('#distribution-of-reputation-histogram'),
      WIDTH = 400,
      HEIGHT = 200,
      MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
      },
      xRange = d3.scale.ordinal().rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.1).domain(barData.map(function(d) {
        return d.token;
      })),


      yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,
        d3.max(barData, function(d) {
          return d.stake;
        })
      ]),

      xAxis = d3.svg.axis()
      .scale(xRange)
      .tickValues([])
      .tickSize(5),

      yAxis = d3.svg.axis()
      .scale(yRange)
      .tickSize(5)
      .orient("left")
      .ticks(0);

    vis.append("text") // text label for the x axis
      .attr("x", WIDTH / 2)
      .attr("y", HEIGHT + MARGINS.bottom)
      .style("text-anchor", "middle")
      .text("valuation");
    vis.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", MARGINS.left / 2 - 15)
      .attr("x", 0 - (HEIGHT / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("reputation weight");
    vis.append('svg:g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
      .call(xAxis);

    vis.append('svg:g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
      .call(yAxis);

    vis.selectAll('rect')
      .data(barData)
      .enter()
      .append('rect')
      .attr('x', function(d) {
        return xRange(d.token);
      })
      .attr('y', function(d) {
        return yRange(d.stake);
      })
      .attr('width', xRange.rangeBand())
      .attr('height', function(d) {
        return ((HEIGHT - MARGINS.bottom) - yRange(d.stake));
      })
      .attr('fill', function(d) {
        return (d.color);
      });


  }

  function InitLineChart(bids) {
    var myBidValue = 0;
    var maxContributionValueAfterBid = 0;
    var data = [];
    data.push({
      "contribution_value_after_bid": 0,
      "num": 0
    });
    for (var i = 0; i < bids.length; i++) {
      bids[i].num = i + 1;
      if (bids[i].contribution_value_after_bid > maxContributionValueAfterBid) {
        maxContributionValueAfterBid = bids[i].contribution_value_after_bid;
      }
      if (bids[i].owner == $scope.userId) {
        myBidValue = bids[i].tokens;
      }
      data.push(bids[i]);
    }


    var vis = d3.select("#contribution-value-line-graph"),
      WIDTH = 400,
      HEIGHT = 200,
      MARGINS = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 50
      },
      xScale = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([0, bids.length]),
      yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, maxContributionValueAfterBid]),
      xAxis = d3.svg.axis()
      .scale(xScale)
      .ticks(0),
      yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(0);
    vis.append("text") // text label for the x axis
      .attr("x", WIDTH / 2)
      .attr("y", HEIGHT + MARGINS.bottom)
      .style("text-anchor", "middle")
      .text("Time(backFeeds)");
    vis.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", MARGINS.left / 2 - 10)
      .attr("x", 0 - (HEIGHT / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Valuation(tokens)");
    vis.append("svg:g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
      .call(xAxis);
    vis.append("svg:g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + (MARGINS.left) + ",0)")
      .call(yAxis);
    var lineGen = d3.svg.line()
      .x(function(d) {
        return xScale(d.num);
      })
      .y(function(d) {
        return yScale(d.contribution_value_after_bid);
      })
      .interpolate("basis");
    var lineGen1 = d3.svg.line()
      .x(function(d) {
        return xScale(d.num);
      })
      .y(function(d) {
        return yScale(myBidValue);
      })
      .interpolate("basis");
    vis.append('svg:path')
      .attr('d', lineGen(data))
      .attr('stroke', 'blue')
      .attr('stroke-width', 2)
      .attr('fill', 'none');
    vis.append('svg:path')
      .attr('d', lineGen1(data))
      .attr('stroke', 'brown')
      .attr('stroke-dasharray', '5,5')
      .attr('stroke-width', 2)
      .attr('fill', 'none');

  }


  function getContributionStatus() {
    if ($scope.contributionId && $scope.contributionId != 0 && $scope.userId && $scope.userId != 0) {
      $scope.contributionStatus = ContributionStatus.getDetail({
        id: $scope.contributionId,
        userId: $scope.userId
      });
      $scope.contributionStatus.$promise.then(function(result) {
        $scope.contributionStatusModel = result;
        $scope.contributionStatusModel.contributionContributers.sort(compareRanks);
        $scope.contributionStatusModel.myWeight = $scope.contributionStatusModel.myWeight.toFixed(2);
        $scope.contributionStatusModel.groupWeight = $scope.contributionStatusModel.groupWeight.toFixed(2);
        $scope.contributionStatusModel.bids.sort(compareBids);
        InitLineChart($scope.contributionStatusModel.bids);
        InitBarChart($scope.contributionStatusModel.bids);
      });
      PostMessageService.sendGesture('showIframe');
    }
  };

  function getProfile() {
    Account.getProfile()
      .success(function(data) {
        $scope.userId = data.userId;
        Account.setUserData(data);
        getContributionStatus();
      })
      .error(function(error) {
        PostMessageService.gesture.showAlert(error.message, 'error');
      });
  };

}