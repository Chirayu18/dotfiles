M = {}
local opts = { noremap = true, silent = true }

-- Shorten function name
local map = vim.api.nvim_set_keymap

-- Map leader
map("n", "<Space>", "", opts)
vim.g.mapleader = " "
vim.g.maplocalleader = " "

map("i", "jj", "<ESC>", opts)

-- Copy to Clipboard
--map("n", "<leader>y", '"+y', opts)
--map("n", "<leader>Y", '"+Y', opts)
--map("v", "<leader>y", '"+y', opts)
--map("v", "<leader>Y", '"+Y', opts)

-- Paste from clipboard
--map("n", "<leader>p", '"+p', opts)
--map("n", "<leader>P", '"+P', opts)
--map("v", "<leader>p", '"+p', opts)
--map("v", "<leader>P", '"+P', opts)

-- Paste from yanked registry
map("n", "<leader>p", '"0p', opts)
map("n", "<leader>P", '"0P', opts)
map("v", "<leader>p", '"0p', opts)
map("v", "<leader>P", '"0P', opts)

map("n", "<leader>no", ":nohl<CR>", opts)
map("n", "<leader>w", ":w<CR>", opts)
map("n", "<leader>W", ":lua require('user.custom').sessionsave()<cr>", opts)
map("n", "<leader>q", ":bd<CR>", opts)
map("n", "<leader>Q", ":qall!<CR>", opts)

map("n", "<leader>x", "<cmd>TroubleToggle<cr>", opts)
map("n", "gr", "<cmd>TroubleToggle lsp_references<cr>", opts)
map("n", "gI", "<cmd>TroubleToggle lsp_implementations<cr>", opts)
map("n", "gD", "<cmd>TroubleToggle lsp_definitions<cr>", opts)

-- Telescope Bindings
map("n", "<leader>ff", "<cmd>Telescope find_files<cr>", opts)
map("n", "<leader>b", "<cmd>Telescope buffers initial_mode=normal<cr>", opts)
map("n", "<leader>fg", "<cmd>Telescope live_grep<cr>", opts)
map("n", "<leader>fr", "<cmd>Telescope registers<cr>", opts)
map("n", "<leader>h", "<cmd>Telescope oldfiles initial_mode=normal<cr>", opts)
map("n", "<leader>.", "<cmd>Telescope marks<cr>", opts)
map("n", "<leader>o", "<cmd>Telescope treesitter<cr>", opts)

--Replace based maps
map("n", "<leader>rl", ":s/", opts)
map("n", "<leader>rf", ":%s/", opts)

--Session based maps
map("n", "<leader>sl", ":lua require('user.telescope').sessionload()<cr>", opts)
map("n", "<leader>sd", ":lua require('user.telescope').sessiondelete()<cr>", opts)
map("n", "<leader>ss", ":Ss ", opts)

--Open ranger via Rnvimr
map("n", "<leader>e", "<cmd>RnvimrToggle<cr>", opts)

map("n", "<leader>g", "<cmd>HopWord<cr>", opts)

--LSP mappings
function M.lsp_keymaps(bufnr)
	---@diagnostic disable-next-line: redefined-local
	local opts = { noremap = true, silent = true, buffer = bufnr }
	local lmap = vim.keymap.set
	lmap("n", "gd", vim.lsp.buf.definition, opts) --	lmap("n", "gD", vim.lsp.buf.declaration, opts)
	-- lmap("n", "K", vim.lsp.buf.hover, opts)
	--	lmap("n", "gI", vim.lsp.buf.implementation, opts)
	--	lmap("n", "gr", vim.lsp.buf.references, opts)
	-- lmap("n", "gl", vim.diagnostic.open_float, opts)
	-- lmap("n", "gs", vim.lsp.buf.signature_help, opts)
	vim.cmd(
		[[ command! Format execute 'lua vim.lsp.buf.formatting({ async = true , trimTrailingWhitespace = true })' ]]
	)
	lmap("n", "<leader>fo", "<cmd>Format<cr>", opts)
	lmap("n", "<leader>a", vim.lsp.buf.code_action, opts)
	lmap("v", "<leader>a", vim.lsp.buf.code_action, opts)

	if vim.bo.filetype == "tex" then
		lmap("n", "<leader>dd", "<cmd>TroubleToggle quickfix<cr>", opts) --Vimtex populates quickfixlist
		-- dianostics so take dianostics from there
	else
		lmap("n", "<leader>dd", "<cmd>TroubleToggle document_diagnostics<cr>", opts)
	end
end

local cmp = require("cmp")
local has_words_before = function()
	local line, col = unpack(vim.api.nvim_win_get_cursor(0))
	return col ~= 0 and vim.api.nvim_buf_get_lines(0, line - 1, line, true)[1]:sub(col, col):match("%s") == nil
end

local luasnip = require("luasnip")

-- Completion Mappings
M.cmp_mappings = {
	["<Tab>"] = cmp.mapping(function(fallback)
		if cmp.visible() then
			cmp.select_next_item()
		elseif luasnip.expandable() then
			luasnip.expand()
		elseif has_words_before() then
			cmp.complete()
		else
			fallback()
		end
	end, { "i", "s" }),

	["<C-K>"] = cmp.mapping(function(fallback)
		if luasnip.jumpable() then
			luasnip.expand_or_jump()
		end
	end, { "i", "s" }),
	["<S-Tab>"] = cmp.mapping(function(fallback)
		if cmp.visible() then
			cmp.select_prev_item()
		elseif luasnip.jumpable(-1) then
			luasnip.jump(-1)
		else
			fallback()
		end
	end, { "i", "s" }),
	["<C-b>"] = cmp.mapping.scroll_docs(-4),
	["<C-f>"] = cmp.mapping.scroll_docs(4),
	["<C-Space>"] = cmp.mapping.complete(),
	["<C-e>"] = cmp.mapping.abort(),
	["<CR>"] = cmp.mapping.confirm({ select = true }), -- Accept currently selected item. Set `select` to `false` to only confirm explicitly selected items.
	vim.keymap.set({ "i", "s" }, "<C-s>", function()
		if ls.choice_active() then
			ls.change_choice(1)
		end
	end),
}

--Hop mappings for better f
map("", "f", "<cmd>lua require'hop'.hint_char1({ current_line_only = true,})<cr>", {})
map("", "F", "<cmd>lua require'hop'.hint_char1({ current_line_only = false })<cr>", {})

return M
