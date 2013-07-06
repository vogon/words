
class Poem
	def initialize(lines)
		self.lines = lines
	end

	def to_json
		JSON.dump(self.lines)
	end

	attr_reader :lines

	private
	attr_writer :lines
end