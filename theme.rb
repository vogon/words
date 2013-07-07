class Theme
	def self.loadAll(path)
		themes = []
		common_theme = nil

		raise ArgumentError, "path isn't a directory" if !File.directory?(path)

		Dir.open(path) do |dir|
			dir.each do |subdir|
				if (subdir != "." && subdir != "..") then
					theme = Theme.new("#{path}/#{subdir}")

					if (subdir == "common") then
						common_theme = theme
					else
						themes << theme
					end
				end
			end
		end

		return themes, common_theme
	end

	def initialize(path)
		self.theme = File.basename(path)

		raise ArgumentError, "path isn't a directory" if !File.directory?(path)

		File.open(path + "/wordlist.txt") do |f|
			self.words = f.readlines
		end
	end

	public
	attr_reader :theme
	attr_reader :words

	private
	attr_writer :theme
	attr_writer :words
end