M = {}
local cmp = require("cmp")

local kind_icons = require("user.icons").kind_icons
M.capabilities = require("cmp_nvim_lsp").update_capabilities(vim.lsp.protocol.make_client_capabilities())
require("cmp").setup({
	formatting = {
		format = function(entry, vim_item)
			-- Kind icons
			vim_item.kind = string.format("%s %s", kind_icons[vim_item.kind], vim_item.kind) -- This concatonates the icons with the name of the item kind
			-- vim_item.kind = string.format("%s", kind_icons[vim_item.kind])
			-- Source
			vim_item.menu = ({
				buffer = "[Buffer]",
				nvim_lsp = "[LSP]",
				luasnip = "[LuaSnip]",
				nvim_lua = "[Lua]",
				latex_symbols = "[LaTeX]",
			})[entry.source.name]
			return vim_item
		end,
	},
	snippet = {
		expand = function(args)
			require("luasnip").lsp_expand(args.body)
		end,
	},

	sources = {
		{ name = "nvim_lsp" },
		{ name = "luasnip" },
		{ name = "buffer" },
		{ name = "path" },
		{ name = "omni" },
		{ name = "emoji" },
		{ name = "neorg" },
		{ name = "latex_symbols" },
	},

	window = {
		-- completion = cmp.config.window.bordered(),
		-- documentation = cmp.config.window.bordered(),
	},
	mapping = cmp.mapping.preset.insert(require("user.mappings").cmp_mappings),
})

cmp.setup.cmdline("/", {
	mapping = cmp.mapping.preset.cmdline(),
	formatting = {
		format = function(entry, vim_item)
			vim_item.kind = ""
			return vim_item
		end,
	},
	sources = {
		{ name = "buffer" },
	},
})

-- Use cmdline & path source for ':' (if you enabled `native_menu`, this won't work anymore).
cmp.setup.cmdline(":", {
	mapping = cmp.mapping.preset.cmdline(),
	formatting = {
		format = function(entry, vim_item)
			vim_item.kind = ""
			return vim_item
		end,
	},
	sources = cmp.config.sources({
		{ name = "path" },
	}, {
		{ name = "cmdline" },
	}),
})
return M
