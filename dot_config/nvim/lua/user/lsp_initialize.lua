local M = {}

local function navic()
	--TODO: navic config here
end

M.on_attach = function(client, bufnr)
	require('user.mappings').lsp_keymaps(bufnr)
	-- TODO: stuff here
end
return M
