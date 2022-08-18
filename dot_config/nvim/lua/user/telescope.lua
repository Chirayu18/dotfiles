M = {}
local actions = require("telescope.actions")
local previewers = require("telescope.previewers")

--new previewer to limit size of file for preview
local new_maker = function(filepath, bufnr, opts)
	opts = opts or {}

	filepath = vim.fn.expand(filepath)
	vim.loop.fs_stat(filepath, function(_, stat)
		if not stat then
			return
		end
		if stat.size > 100000 then
			return
		else
			previewers.buffer_previewer_maker(filepath, bufnr, opts)
		end
	end)
end

local actions = require("telescope.actions")
local action_state = require("telescope.actions.state")

local function read_session(prompt_bufnr, map)
	actions.select_default:replace(function()
		actions.close(prompt_bufnr)
		local selection = action_state.get_selected_entry()
		vim.cmd([[source /home/arsonstan/.config/nvim/sessions/]] .. selection[1])
		vim.g.Sessionname = selection[1]
	end)
	return true
end

local function delete_session(prompt_bufnr, map)
	actions.select_default:replace(function()
		actions.close(prompt_bufnr)
		local selection = action_state.get_selected_entry()
		vim.cmd([[!rm /home/arsonstan/.config/nvim/sessions/]] .. selection[1])
	end)
	return true
end

M.sessionload = function()
	local opts = {
		cwd = "/home/arsonstan/.config/nvim/sessions",
		previewer = false,
		attach_mappings = read_session,
	}
	require("telescope.builtin").find_files(opts)
end

M.sessiondelete = function()
	local opts = {
		cwd = "/home/arsonstan/.config/nvim/sessions",
		previewer = false,
		attach_mappings = delete_session,
	}
	require("telescope.builtin").find_files(opts)
end

require("telescope").setup({
	defaults = {
		-- Default configuration for telescope goes here:
		-- config_key = value,
		mappings = {
			n = {
				["<C-j>"] = actions.select_default,
				["q"] = actions.close,
			},
			i = {
				["<C-j>"] = actions.select_default,
				["<esc>"] = actions.close,
				--				["<C-h>"] = "which_key",
			},
		},
	},
	pickers = {
		-- Default configuration for builtin pickers goes here:
		-- picker_name = {
		--   picker_config_key = value,
		--   ...
		-- }
		-- Now the picker_config_key will be applied every time you call this
		-- builtin picker
	},
	extensions = {
		-- Your extension configuration goes here:
		-- extension_name = {
		--   extension_config_key = value,
		-- }
		-- please take a look at the readme of the extension you want to configure
	},
	buffer_previewer_maker = new_maker,
})
return M
