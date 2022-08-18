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
local file_pattern = "*.tex"
local tex = {}
tex.in_mathzone = function()
	return vim.fn["vimtex#syntax#in_mathzone"]() == 1
end
tex.in_text = function()
	return not tex.in_mathzone()
end
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
			elseif opts == "math" then
				target_table = autosnippets
				snippet = s(trigger, nodes, { condition = tex.in_mathzone })
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
		if opts ~= "auto" and opts ~= "math" then
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
table_node = function(args)
	local tabs = {}
	local count
	table = args[1][1]:gsub("%s", ""):gsub("|", "")
	count = table:len()
	for j = 1, count do
		local iNode
		iNode = i(j)
		tabs[2 * j - 1] = iNode
		if j ~= count then
			tabs[2 * j] = t(" & ")
		end
	end
	return sn(nil, tabs)
end
rec_table = function()
	return sn(nil, {
		c(1, {
			t({ "" }),
			sn(nil, { t({ "\\\\", "" }), d(1, table_node, { ai[1] }), d(2, rec_table, { ai[1] }) }),
		}),
	})
end
local rec_ls
rec_ls = function()
	return sn(nil, {
		c(1, {
			-- important!! Having the sn(...) as the first choice will cause infinite recursion.
			t({ "" }),
			-- The same dynamicNode as in the snippet (also note: self reference).
			sn(nil, { t({ "", "\t\\item " }), i(1), d(2, rec_ls, {}) }),
		}),
	})
end

cs("bitems", {
	t({ "\\begin{itemize}", "\t\\item " }),
	i(1),
	d(2, rec_ls, {}),
	t({ "", "\\end{itemize}" }),
	i(0),
})
cs("btable", {
	t("\\begin{tabular}{"),
	i(1, "0"),
	t({ "}", "" }),
	d(2, table_node, { 1 }, {}),
	d(3, rec_table, { 1 }),
	t({ "", "\\end{tabular}" }),
})
cs(
	"mathmulti",
	fmt(-- Enter Math mode Multi line
		[[
		\[ {} \]
]],
		{
			i(1, "Equation"),
		}
	),
	"jm"
)
cs(
	"mathsingle",
	fmt(-- Enter Math mode Single line
		[[
		\( {} \)
]],
		{
			i(1, ""),
		}
	),
	"jl"
)
cs(
	"item",
	fmt(-- Add Item to itemize
		[[
\item {}
]],
		{
			i(1, "New Item"),
		}
	),
	"jii"
)
cs(
	"environmentEquation",
	fmt(-- Enter Equation environment
		[[
		\begin{{equation}}
			{}
			\label{{eq:{}}}
		\end{{equation}}
]],
		{
			i(1, "Equation"),
			i(2, "Name of equation"),
		}
	),
	"jee"
)

cs(
	"ref",
	fmt(-- Create Reference
		[[
[Equation \ref{{eq:{}}}]
]],
		{
			i(1, ""),
		}
	),
	"jr"
)
cs(
	"preamble_notes",
	fmt(-- Create a preamble for preamble for notes
		[[
\documentclass{{scrartcl}}
\usepackage[utf8]{{inputenc}}
\usepackage[
backend=biber,
style=numeric,
sorting=ynt
]{{biblatex}}
\usepackage{{amsmath}}
\usepackage{{graphicx}}
\newtheorem{{theorem}}{{Theorem}}
\usepackage[a4paper, total={{6in, 9in}}]{{geometry}}
\addbibresource{{references.bib}}
\title{{ {} \\ \large{{ {} }} }}

\author{{Chirayu Gupta}}
\date{{}}
\begin{{document}}
\maketitle
{}
\end{{document}}
]],
		{
			i(1, "Title"),
			i(2, "Course Code"),
			i(3, "Start here"),
		}
	)
)
cs(-- Fraction
	{ trig = "([%d]+)/", regTrig = true, hidden = true },
	fmt(
		[[ 
\frac{{ {} }}{{ {} }}
]],
		{
			d(1, function(_, snip)
				return sn(1, i(1, snip.captures[1]))
			end),
			i(2, ""),
		}
	)
)
cs(-- AutoUnderScore
	{ trig = "([%w]+)([%d])", regTrig = true, hidden = true },
	fmt([[{}_{}]], {
		f(function(_, snip)
			return snip.captures[1]
		end),
		f(function(_, snip)
			return snip.captures[2]
		end),
	}),
	"auto"
)
cs(
	"kk",
	fmt(-- Add \ and {}
		[[
\{}{{{}}}
]],
		{
			i(1, "element"),
			i(2, "subscript"),
		}
	),
	"math"
)
cs(
	"vv",
	fmt(-- Vector
		[[
\va{{{}}}
]],
		{
			i(1, "Vector"),
		}
	),
	"math"
)
cs(
	"dv",
	fmt(-- Diffrentiation
		[[
\dv{{{}}}{{{}}}
]],
		{
			i(1, "N"),
			i(2, "D"),
		}
	),
	"math"
)
cs(
	"pdv",
	fmt(-- Partial Diffrentiation
		[[
\pdv{{{}}}{{{}}}
]],
		{
			i(1, "N"),
			i(2, "D"),
		}
	),
	"math"
)
cs(
	"bra",
	fmt(-- Bra vector
		[[
\bra{{{}}}
]],
		{
			i(1, "ψ"),
		}
	),
	"math"
)
cs(
	"ket",
	fmt(-- Ket vector
		[[
\ket{{{}}}
]],
		{
			i(1, "ψ"),
		}
	),
	"math"
)
cs(
	"op",
	fmt(-- Operator insert
		[[
\hat{{{}}}
]],
		{
			i(1, "H"),
		}
	),
	"math"
)
return snippets, autosnippets
