def bake_line(words)
	text = ""

	words.each do |word|
		if (word =~ /^-(\w+)/ && text != "") then
			# word is a suffix and the line isn't empty;
			# tack the suffix onto the previous word
			text += $~[1]
		else
			text += " " if (text != "")
			text += word
		end
	end

	return text
end