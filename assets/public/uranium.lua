local newtool = Instance.new("Tool")
local handle = Instance.new("Part")
local sound = Instance.new("Sound")


newtool.Name = "Uranium"
handle.Name = "Handle"
handle.Size = Vector3.new(1.5,1.5,1.5)
handle.Parent = newtool
handle.BrickColor = BrickColor.new(0,255,0)
handle.Material = "Neon"
sound.Parent = handle
sound.SoundId = "rbxassetid://145214482"
sound:Play()

newtool.Parent = game.Players.AngelDav943.Backpack