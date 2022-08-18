--Start BoilerPlateCode
local ls = require("luasnip") --{{{
local s = ls.s
local i = ls.i
local t = ls.t
local d = ls.dynamic_node
local c = ls.choice_node
local f = ls.function_node
local sn = ls.snippet_node

local fmt = require("luasnip.extras.fmt").fmt
local rep = require("luasnip.extras").rep

local snippets, autosnippets = {}, {} --}}}

local group = vim.api.nvim_create_augroup("Lua Snippets", { clear = true })
local file_pattern = "*.py"
local function cs(trigger, nodes, opts) --{{{
	local snippet = s(trigger, nodes)
	local target_table = snippets

	local pattern = file_pattern
	local keymaps = {}

	if opts ~= nil then
		-- check for custom pattern
		if opts.pattern then
			pattern = opts.pattern
		end

		-- if opts is a string
		if type(opts) == "string" then
			if opts == "auto" then
				target_table = autosnippets
			else
				table.insert(keymaps, { "i", opts })
			end
		end

		-- if opts is a table
		if opts ~= nil and type(opts) == "table" then
			for _, keymap in ipairs(opts) do
				if type(keymap) == "string" then
					table.insert(keymaps, { "i", keymap })
				else
					table.insert(keymaps, keymap)
				end
			end
		end

		-- set autocmd for each keymap
		if opts ~= "auto" then
			for _, keymap in ipairs(keymaps) do
				vim.api.nvim_create_autocmd("BufEnter", {
					pattern = pattern,
					group = group,
					callback = function()
						vim.keymap.set(keymap[1], keymap[2], function()
							ls.snip_expand(snippet)
						end, { noremap = true, silent = true, buffer = true })
					end,
				})
			end
		end
	end

	table.insert(target_table, snippet) -- insert snippet into appropriate table
end --}}}

-- End BoilerPlateCode
cs(-- Python for loop
	{ trig = "for([%w_]+)", regTrig = true, hidden = true },
	fmt(
		[[ 
for {} in {}:
	{}
]],
		{
			d(1, function(_, snip)
				return sn(1, i(1, snip.captures[1]))
			end),
			c(2, { i(1, "list"), sn(1, { t("range("), i(1, "0"), t(","), i(2, "100"), t(")") }) }),
			i(3, "#TODO:Loop body here"),
		}
	)
)
cs(-- Python While loop
	{ trig = "while([%w_]+)", regTrig = true, hidden = true },
	fmt(
		[[ 
while ({} {}):
	{}
	{}+=1
]],
		{
			d(1, function(_, snip)
				return sn(1, i(1, snip.captures[1]))
			end),
			i(2, "condition"),
			i(3, "#TODO:Loop body"),
			rep(1),
		}
	)
)
table.insert(snippets, fn)
table.insert(autosnippets, fna)
return snippets, autosnippets
