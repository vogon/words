require 'sinatra'
require 'slim'

class WordsAPI < Sinatra::Base
	get '/choosewords' do
		
	end

	post '/submit' do

	end

	get '/game' do

	end

	get '/' do
		slim :words
	end
end