
class PoemWord
	def initialize(word, x, y)
		self.word = word
		self.x, self.y = x, y
	end

	attr_accessor :word
	attr_accessor :x, :y
end

class Poem
	def initialize
		:words = []
	end

	attr_accessor :words
end