vim.g.Sessionname = ""
--vim.cmd [[syntax enable]]
local options = {
	number = true,

	syntax = enable,
	completeopt = menu,
	menuone,
	noselect,

	termguicolors = true,
	relativenumber = true,

	clipboard = "unnamedplus",

	mouse = a,
	cmdheight = 1,
	ignorecase = true,
	magic = true,
	smarttab = true,
	showmatch = true,
	hidden = true,
	updatetime = 300,

	--Shada file data store
	shada = "'1000,f1,<500",

	signcolumn = number,

	-- Persistant undo
	undodir = "/home/arsonstan/.vim_runtime/temp_dirs/undodir",
	undofile = true,

	modifiable = true,
}

--VimTex related options
vim.g.vimtex_view_method = "zathura"
vim.g.vimtex_compiler_silent = 0
vim.g.vimtex_quickfix_mode = 0
--vim.g.vimtex_compiler_method = 'latexrun'

local icons = require("user.icons")

local function lspSymbol(name, icon)
	vim.fn.sign_define(
		"DiagnosticSign" .. name,
		{ text = icon, texthl = "Diagnostic" .. name, numhl = "DiagnosticDefault" .. name }
	)
end

lspSymbol("Error", icons.diagnostics.Error)
lspSymbol("Information", icons.diagnostics.Information)
lspSymbol("Warn", icons.diagnostics.Warning)
lspSymbol("Hint", icons.diagnostics.Hint)

local diagnostic_config = {

	virtual_text = true, -- disable virtual text

	update_in_insert = true,
	underline = true,
	severity_sort = true,

	float = {
		focusable = true,
		style = "minimal",
		border = "rounded",
		source = "always",
		header = "",
		prefix = "",
	},
}

vim.lsp.handlers["textDocument/hover"] = vim.lsp.with(vim.lsp.handlers.hover, {
	border = "rounded",
	width = 60,
	-- height = 30,
})

vim.lsp.handlers["textDocument/signatureHelp"] = vim.lsp.with(vim.lsp.handlers.signature_help, {
	border = "rounded",
	width = 60,
	-- height = 30,
})

for k, v in pairs(options) do
	vim.opt[k] = v
end

vim.opt.shortmess:append({ c })
vim.diagnostic.config(diagnostic_config)

vim.api.nvim_set_hl(0, "Pmenu", { ctermbg = black, ctermfg = white })
