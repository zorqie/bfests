const e = {
	_id : "58bf2831dd772800111a664d",
	parent : "58bf27d5dd772800111a6649",
	start : "2017-05-27T18:00:00.000Z",
	type : "Volunteer",
	name : "Dishwashing",
	description: "Washing of dishes and such 2",
	venue_id :"58a265fbff139ec77373d2a7",
	end :"2017-05-27T19:45:00.000Z",
	__v :0,
	act_id :["58b7f64b280c9139824cc9b5"],
	public :false,
	acts :[{
		_id :"58b7f64b280c9139824cc9b5",
		name :"Special Surprise Guest"
	}],
	venue :{
		_id :"58a265fbff139ec77373d2a7",
		name :"Kitchen",
		capacity :24,
		type :"service",
		parent :"588bf21d9d47e5d6f61ba9f0"
	},
	ticket_rules: [
		{
			ord: 0,
			status: null,
			actions: [
				{
					name: "Get tickets",
					newStatus: "Volunteering"
				}
			]
		},
		{
			ord: 1,
			status: "Volunteering",
			reqires: {status: "Volunteering", minCount: 1},
			actions: [
				{
					name: "Volunteer",
					path: "/events/:eventId"
				}
			]
		},
		{
			ord: 2,
			status: "Volunteering",
			reqires: {status: "Volunteering", minCount: 3},
			actions: [
				{
					name: "Purchase tickets",
					path: "/purchase/:eventId"
				},
				{	
					name: "View training",
					path: "/training/:eventId"
				},
				{
					//default
					newStatus: "Training"
				}
			]
		},
		{
			ord: 3,
			status: "Training",
			requires: {status: "Training", minCount: 1},
			actions: [
				{	
					name: "View training",
					path: "/training/:eventId"
				},
				{
					//default
					newStatus: "Payment"
				}
			]
		},
		{
			ord: 4,
			status: "Training",
			requires: [
				{status: "Training", minCount: 3},
				{status: "Payment", minCount: 1},
			],
			actions: [
				{	
					name: "Get passes",
					path: "/passes/:eventId"
				},
				{
					//default
					newStatus: "Attending"
				}
			]
		},
	]
}