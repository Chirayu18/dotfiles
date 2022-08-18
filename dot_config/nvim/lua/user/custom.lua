M = {}
vim.cmd([[command! -nargs=1 Ss mksession! ~/.config/nvim/sessions/<args>.vim | let g:Sessionname = '<args>.vim']])
M.sessionsave = function()
	vim.cmd([[:wall]])
	if vim.g.Sessionname ~= "" then
		vim.cmd([[:execute "mksession!" '~/.config/nvim/sessions/'..Sessionname]])
		vim.cmd([[:echo 'Session' Sessionname 'saved']])
		-- TODO: replace with vim.notify
	end
end
return M
