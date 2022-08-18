-- Define language specific options here
local pyright_opts = {}
local sumneko_lua_opts = {}
local ltex_opts = {}

local on_attach = function(client, bufnr)
	require("user.mappings").lsp_keymaps(bufnr)
end

local opts = {
	capabilities = require("user.completions").capabilities,
	on_attach = on_attach,
}

--Keep adding LSPs here after defining language specific options above
require("lspconfig").pyright.setup(vim.tbl_deep_extend("force", pyright_opts, opts))
require("lspconfig").sumneko_lua.setup(vim.tbl_deep_extend("force", sumneko_lua_opts, opts))
require("lspconfig").ltex.setup(vim.tbl_deep_extend("force", ltex_opts, opts))

require("nvim-lsp-installer").setup({
	-- Nvim lsp installer config
	automatic_installation = true, -- automatically detect which servers to install (based on which servers are set up via lspconfig)
	ui = {
		icons = {
			server_installed = "✓",
			server_pending = "➜",
			server_uninstalled = "✗",
		},
		keymaps = {
			toggle_server_expand = "<CR>",
			install_server = "i",
			update_server = "u",
			check_server_version = "c",
			update_all_servers = "U",
			check_outdated_servers = "C",
			uninstall_server = "X",
		},
	},
})
