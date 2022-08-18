local use = require("packer").use
require("packer").startup(function()
	use("wbthomason/packer.nvim") -- Package manager
	use("neovim/nvim-lspconfig") -- Configurations for Nvim LSP
	use("williamboman/nvim-lsp-installer") --LSP installer
	use("navarasu/onedark.nvim") -- Colorscheme
	use("kyazdani42/nvim-web-devicons") --Icons and required by trouble
	use("folke/trouble.nvim") --Better quicklist like plugin
	use("nvim-lua/plenary.nvim") --requirement for many plugins
	use("jose-elias-alvarez/null-ls.nvim") --Provide diagnostics, completions,formatting from various sources
	use("L3MON4D3/LuaSnip")
	use("nvim-treesitter/nvim-treesitter")

	--Completion Plugins
	use("saadparwaiz1/cmp_luasnip") -- LuaSnip integration with cmp
	use("hrsh7th/nvim-cmp")
	use("hrsh7th/cmp-omni") -- For Vimtex
	use("hrsh7th/cmp-nvim-lsp")
	use("hrsh7th/cmp-buffer")
	use("hrsh7th/cmp-path")
	use("hrsh7th/cmp-cmdline")
	use("kdheepak/cmp-latex-symbols")
	use("hrsh7th/cmp-emoji")
	use("windwp/nvim-autopairs")

	use("kevinhwang91/rnvimr")

	use("nvim-neorg/neorg")
	use("nvim-neorg/neorg-telescope")

	use("nvim-telescope/telescope.nvim")

	use({
		"phaazon/hop.nvim",
		branch = "v2", -- optional but strongly recommended
	})

	use("nvim-lualine/lualine.nvim")
	use("folke/tokyonight.nvim")
	use("glepnir/dashboard-nvim")
	use({ "michaelb/sniprun", run = "bash ./install.sh" })
	use("lukas-reineke/indent-blankline.nvim")
	use("lervag/vimtex")
	use("anuvyklack/pretty-fold.nvim")
	use("rafamadriz/friendly-snippets")
end)
