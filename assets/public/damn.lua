local newtool = Instance.new("Tool")
local handle = Instance.new("Part")
handle.Name = "Handle"
handle.Parent = newtool

newtool.Parent = game.Players.AngelDav943.Backpack

function pleaseactivate()
	print("where brick?!?!??!??")
	local newbrick = Instance.new("Part")
	newbrick.Parent = workspace
	newbrick.Size = Vector3.new(2,2,2)
		
	local offset = Vector3.new(0,5,0)
	newbrick.Position = handle.Position + offset
end

pleaseactivate()

newtool.Activated:connect(pleaseactivate)

handle.Touched:connect(pleaseactivate)