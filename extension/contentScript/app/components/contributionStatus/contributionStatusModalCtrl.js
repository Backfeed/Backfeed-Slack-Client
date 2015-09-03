angular.module('MyApp').controller(
		'ContributionStatusModalCtrl',
		function($scope, $auth, $location, $stateParams, ContributionStatus,
				Account, Users,$modalInstance,PostMessageService) {
			$scope.cotributionStatusModel = {
					file:'',
					title:'',
					currentValuation : '',
					myWeight : '',
					myValuation : '',
					reputationDelta : '',
					groupWeight : '',
					bids : [ {
						time_created : '',
		                tokens:'',
		                reputation: '',
		                contribution_value_after_bid:'',
		                owner:'',
		                stake:''
		            } ],
		            contributionContributers : [ {
		            	contributer_percentage : '',
		            	name:'',
		            	real_name: '',
		            	url:''
		            } ]
				};

	        $scope.closeModal = function() {
	            $modalInstance.dismiss('cancel');
	        };	
	        function compareBids(a,b) {
		        	a = new Date(a.time_created);
		            b = new Date(b.time_created);
		            return a>b ? 1 : a<b ? -1 : 0;	        	  
	        	}
	        function InitBarChart(bids) {
	        	var maxToken = 0;
	        	var myStake = 0;
	        	for(i = 0;i<bids.length; i++){
	        		if(bids[i].tokens > maxToken){
	        			maxToken = bids[i].tokens;
	        		}
	        		if(bids[i].owner == $scope.userId){
	        			myStake = bids[i].stake;
	        		}
	        	}
	        	var bin = 10;
	        	var eachBucketSize = maxToken/bin;
	        	var barData = [];
	        	var binData=[];
	        	for (i=1;i<=bin;i++){
	        		binData.push(0);
	        	}
	        	var totalStake = 0;
	        	var mybidIndex  = 0;
	        	for(i = 0;i<bids.length; i++){
	        		totalStake = totalStake + bids[i].stake;
	        		
	        		for (j=1;j<=bin;j++){
	        			
	        			if(bids[i].tokens <= j*eachBucketSize && bids[i].tokens > (j-1)*eachBucketSize){
	        				if(bids[i].owner == $scope.userId){
	        					mybidIndex = j-1;
	        				}
	        				binData[j-1] = binData[j-1] + bids[i].stake;
	        				break;
	        			}
	        		}
	        	}
	        	for (i=0;i<bin;i++){
	        		var counter = (i+1)*eachBucketSize;
	        		var stakePer = (binData[i]/totalStake)*100;
	        		
	        		barData.push({"token":counter,"stake":stakePer,"color":"blue"});
	        		if(i == mybidIndex){
	        			barData.push({"token":counter,"stake":(myStake/totalStake)*100,"color":"brown"});
	        		}
	        	}
	        	 var vis = d3.select('#visualisation_bar'),
	        	    WIDTH = 400,
	        	    HEIGHT = 200,
	        	    MARGINS = {
	        	      top: 20,
	        	      right: 20,
	        	      bottom: 20,
	        	      left: 50
	        	    },
	        	    xRange = d3.scale.ordinal().rangeRoundBands([MARGINS.left, WIDTH - MARGINS.right], 0.1).domain(barData.map(function (d) {
	        	      return d.token;
	        	    })),


	        	    yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0,
	        	      d3.max(barData, function (d) {
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

	        	 vis.append("text")      // text label for the x axis
	                .attr("x", WIDTH / 2 )
	                .attr("y", HEIGHT + MARGINS.bottom )
	                .style("text-anchor", "middle")
	                .text("valuation");
	                vis.append("text")
	                .attr("transform", "rotate(-90)")
	                .attr("y", MARGINS.left/2 - 15)
	                .attr("x",0 - (HEIGHT / 2))
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
	        	    .attr('x', function (d) {
	        	      return xRange(d.token);
	        	    })
	        	    .attr('y', function (d) {
	        	      return yRange(d.stake);
	        	    })
	        	    .attr('width', xRange.rangeBand())
	        	    .attr('height', function (d) {
	        	      return ((HEIGHT - MARGINS.bottom) - yRange(d.stake));
	        	    })
	        	    .attr('fill', function (d) {
	        	      return (d.color);
	        	    });
	        	   
	        	    
	        }
	        function InitLineChart(bids) {
	        	var myBidValue = 0;
	        	maxContributionValueAfterBid = 0;
	        	var data = [];
	        	data.push({"contribution_value_after_bid":0,"num":0});
	        	for(i = 0;i<bids.length; i++){
	        		bids[i].num = i+1;
	        		if(bids[i].contribution_value_after_bid > maxContributionValueAfterBid){
	        			maxContributionValueAfterBid = bids[i].contribution_value_after_bid;
	        		}
	        		if(bids[i].owner == $scope.userId){
	        			myBidValue = bids[i].tokens;
	        		}
	        		data.push(bids[i]);
	        	}
	        	
	        	
                var vis = d3.select("#visualisation"),
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
                vis.append("text")      // text label for the x axis
                .attr("x", WIDTH / 2 )
                .attr("y", HEIGHT + MARGINS.bottom )
                .style("text-anchor", "middle")
                .text("Time(backFeeds)");
                vis.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", MARGINS.left/2 - 10)
                .attr("x",0 - (HEIGHT / 2))
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
            
	        
	        $scope.getContributionStatus = function(){
	        	if ($scope.contributionId && $scope.contributionId != 0 && $scope.userId && $scope.userId != 0) {
					$scope.contributionStatus = ContributionStatus.getDetail({
						id : $scope.contributionId,userId : $scope.userId
					});
					$scope.contributionStatus.$promise.then(function(result) {
						$scope.cotributionStatusModel = result;
						$scope.cotributionStatusModel.myWeight = $scope.cotributionStatusModel.myWeight.toFixed(2);
						$scope.cotributionStatusModel.groupWeight = $scope.cotributionStatusModel.groupWeight.toFixed(2);
						$scope.cotributionStatusModel.bids.sort(compareBids);
						InitLineChart($scope.cotributionStatusModel.bids);
						InitBarChart($scope.cotributionStatusModel.bids);
						myWeight = $scope.cotributionStatusModel.myWeight;
						myWeightTooltip = myWeight;
						groupWeight = $scope.cotributionStatusModel.groupWeight;
						groupWeightTooltip = groupWeight;
						remainingWeight = 100 - groupWeight;
						remainingWeightTooltip = remainingWeight;
						groupWeight = groupWeight - myWeight;
						(function(d3) {
					        'use strict';
					        var width = 360;
					        var height = 360;
					        var radius = Math.min(width, height) / 2;
					        var donutWidth = 75;
					        var legendRectSize = 18;
					        var legendSpacing = 4;
					        var color = d3.scale.category20b();
					        var svg = d3.select('#chart')
					          .append('svg')
					          .attr('width', width)
					          .attr('height', height)
					          .append('g')
					          .attr('transform', 'translate(' + (width / 2) + 
					            ',' + (height / 2) + ')');
					        var arc = d3.svg.arc()
					          .innerRadius(radius - donutWidth)
					          .outerRadius(radius);
					        var pie = d3.layout.pie()
					          .value(function(d) { return d.weight; })
					          .sort(null);
					        var tooltip = d3.select('#chart')                               // NEW
					          .append('div')                                                // NEW
					          .attr('class', 'tooltipChart');                                    // NEW
					        tooltip.append('div')                                           // NEW
					          .attr('class', 'percent');                                    // NEW
					        var dataset = [{"label":"Remaining Percentage","weight":groupWeight,"toolTipWeight":groupWeightTooltip,"color":"gray"},
					                       {"label":"My Weight in the holon","weight":myWeight,"toolTipWeight":myWeightTooltip,"color":"brown"},
					                       {"label":"% of the holon that backfeed this value","weight":remainingWeight,"toolTipWeight":remainingWeightTooltip,"color":"green"}];  
					        dataset.forEach(function(d) {
					            d.count = +d.count;
					          });
					          var path = svg.selectAll('path')
					            .data(pie(dataset))
					            .enter()
					            .append('path')
					            .attr('d', arc)
					            .attr('fill', function(d) { 
					              return d.data.color; 
					            });
					          path.on('mouseover', function(d) {                            
					            tooltip.select('.percent').html(d.data.toolTipWeight + '%');             
					            tooltip.style('display', 'block');                          
					          });                                                           
					          
					          path.on('mouseout', function() {                              
					            tooltip.style('display', 'none');                           
					          });                                                           
					         
					            
					          var legend = svg.selectAll('.legend')
					            .data(dataset)
					            .enter()
					            .append('g')
					            .attr('class', 'legend')
					            .attr('transform', function(d, i) {
					              var height = legendRectSize + legendSpacing;
					              var offset =  height * 3 / 2;
					              var horz = -2 * legendRectSize-50;
					              var vert = i * height - offset;
					              return 'translate(' + horz + ',' + vert + ')';
					            });
					          legend.append('rect')
					            .attr('width', legendRectSize)
					            .attr('height', legendRectSize)                                   
					            .style('fill', function(d) { 
					              return d.color; 
					            })
					            .style('stroke', function(d) { 
					              return d.color; 
					            });
					            
					          legend.append('text')
					            .attr('x', legendRectSize + legendSpacing)
					            .attr('y', legendRectSize - legendSpacing)
					            .text(function(d) { return d.label; });
					        
					      })(window.d3);
					      

					});
					PostMessageService.sendGesture('showIframe');
	        	}
	        };
	        
			// if not authenticated return to splash:
			if (!$auth.isAuthenticated()) {
				$location.path('splash');
			} else {
												
				$scope.contributionId = $stateParams.contributionId;
				$scope.getProfile = function() {
					Account.getProfile().success(function(data) {
						$scope.userId = data.userId;
						Account.setUserData(data);
						$scope.getContributionStatus();

					}).error(function(error) {
						PostMessageService.gesture.showAlert(error.message, 'error');
					});
				};
				userData = Account.getUserData();
				console.log("userData is" + userData);
				if (userData == undefined) {
					$scope.getProfile();
				} else {
					$scope.userId = userData.userId;
					$scope.getContributionStatus();
				}
				
				

			}

		});
