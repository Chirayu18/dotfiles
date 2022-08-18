require("nvim-autopairs").setup({
	check_ts = true,
	disable_filetype = { "TelescopePrompt", "vim", "norg" },
	enable_check_bracket_line = false,
	ignored_next_char = "[%w%.]", -- will ignore alphanumeric and `.` symbol
})
local cmp_autopairs = require("nvim-autopairs.completion.cmp")
local cmp = require("cmp")

cmp.event:on(
	"confirm_done",
	cmp_autopairs.on_confirm_done({
		tex = false,
	})
)
