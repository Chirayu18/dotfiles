--require("onedark").setup({
--	style = "deep", -- Default theme style. Choose between 'dark', 'darker', 'cool', 'deep', 'warm', 'warmer' and 'light'
--	transparent = true, -- Show/hide background
--	term_colors = true, -- Change terminal color as per the selected theme style
--	ending_tildes = false, -- Show the end-of-buffer tildes. By default they are hidden
--	cmp_itemkind_reverse = false, -- reverse item kind highlights in cmp menu
--	-- toggle theme style ---
--	toggle_style_key = "<leader>ts", -- Default keybinding to toggle
--	toggle_style_list = { "dark", "darker", "cool", "deep", "warm", "warmer", "light" }, -- List of styles to toggle between
--
--	-- Change code style ---
--	-- Options are italic, bold, underline, none
--	-- You can configure multiple style with comma seperated, For e.g., keywords = 'italic,bold'
--	code_style = {
--		comments = "italic",
--		keywords = "none",
--		functions = "none",
--		strings = "none",
--		variables = "none",
--	},
--
--	-- Custom Highlights --
--	colors = {}, -- Override default colors
--	highlights = {
--		DiagnosticSignError = { fg = "$red" },
--		--	DiagnosticDefaultError = {fg ='$red'}
--	}, -- Override highlight groups
--
--	-- Plugins Config --
--	diagnostics = {
--		darker = true, -- darker colors for diagnostic
--		undercurl = true, -- use undercurl instead of underline for diagnostics
--		background = true, -- use background color for virtual text
--	},
--})
-- require("onedark").load()
--- Example config in Lua

vim.g.tokyonight_style = "night"
vim.g.tokyonight_italic_functions = true
vim.g.tokyonight_transparent = false
vim.g.tokyonight_sidebars = { "qf", "vista_kind", "terminal", "packer" }

-- Change the "hint" color to the "orange" color, and make the "error" color bright red
vim.g.tokyonight_colors = { hint = "orange", error = "#ff0000" }
vim.cmd([[colorscheme tokyonight]])
