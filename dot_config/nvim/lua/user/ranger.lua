local options = {

	-- Make Ranger replace Netrw and be the file explorer
	rnvimr_enable_ex = 1,
	-- Make Ranger to be hidden after picking a file
	rnvimr_enable_picker = 1,

	-- Replace `$EDITOR` candidate with this command to open the selected file
	rnvimr_edit_cmd = "drop",

	-- Disable a border for floating window
	rnvimr_draw_border = 0,

	-- Hide the files included in gitignore
	rnvimr_hide_gitignore = 1,

	-- Change the border's color
	-- rnvimr_border_attr = { ['fg'] = 14, ['bg'] = -1 },

	-- Make Neovim wipe the buffers corresponding to the files deleted by Ranger
	rnvimr_enable_bw = 1,

	-- Add a shadow window, value is equal to 100 will disable shadow
	rnvimr_shadow_winblend = 70,

	-- Draw border with both
	-- rnvimr_ranger_cmd = ['ranger', '--cmd=set draw_borders both']
	--
	-- Map Rnvimr action

	rnvimr_action = {
		["<c-o>"] = "nvimedit",
		["<c-x>"] = "nvimedit split",
		["<c-v>"] = "nvimedit vsplit",
		["gw"] = "jumpnvimcwd",
		["yw"] = "emitrangercwd",
	},

	-- add views for ranger to adapt the size of floating window
	-- fullscreen for initial layout
	-- rnvimr_layout = {
	--            \ 'relative': 'editor',
	--            \ 'width': &columns,
	--            \ 'height': &lines - 2,
	--            \ 'col': 0,
	--            \ 'row': 0,
	--            \ 'style': 'minimal'
	--            \ }
	--
	-- only use initial preset layout
	-- rnvimr_presets = [{}]
}

--for k, v in pairs(options) do
--	vim.opt[k] = v
--end
