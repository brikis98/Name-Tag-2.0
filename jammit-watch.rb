require 'rubygems'
require 'fssm'

class JammitWatch
  def self.compile(base, relative)
	`jammit -c jammit.yml -o public/js`
  end
  
  def self.monitor
    paths = {'app' => '**/*.js'}

	FSSM.monitor do |monitor|
	  paths.each do |path, glob|		
	    monitor.path path do |path|
	      path.glob glob
	      
          path.update { |base, relative| 
            puts "Change detected in #{base}/#{relative}"
            JammitWatch.compile(base, relative)
          }	      
	    end
	  end
	end
  end
end

if $0 == __FILE__
  JammitWatch.monitor
end
