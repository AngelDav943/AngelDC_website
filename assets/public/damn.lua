local active = false
local newtool = Instance.new("Tool")
local handle = Instance.new("Part")
handle.Name = "Handle"
handle.Parent = newtool

newtool.Parent = game.Players.AngelDav943.Backpack

function spawnbrick()
	print("where brick?!?!??!??")
	local newbrick = Instance.new("Part")
	newbrick.Parent = workspace
	newbrick.Size = Vector3.new(2,2,2)

	local offset = Vector3.new(0,5,0)
	newbrick.Position = handle.Position + offset
	
	return newbrick
end

function activate()
	active = true
	
	local currentbrick = spawnbrick()
	local csize = currentbrick.Size.X
	
	currentbrick.CanCollide = false
	currentbrick.Anchored = true
	
	while active == true do
		currentbrick.Position = Vector3.new(handle.Position.X, handle.Position.Y + (csize/2), handle.Position.Z)
		if csize <= 50 then
			currentbrick.Size = Vector3.new(csize, csize, csize)
			csize = csize * 1.1
		end

		if csize == 50 then
			local boom = Instance.new("Explosion")
			boom.Position = handle.Position
			boom.Parent = workspace
			return
		end
		
		wait(0.1)
	end

	currentbrick.Anchored = false
	currentbrick.CanCollide = true
	weld:Destroy()
end

function deactivate()
	active = false
end

newtool.Activated:connect(activate)
newtool.Deactivated:connect(deactivate)